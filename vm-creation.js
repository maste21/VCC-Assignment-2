const { Compute } = require('@google-cloud/compute');
const { Iam } = require('@google-cloud/iam');

async function createScalableVM() {
  const compute = new Compute();
  const iam = new Iam();
  const projectId = 'vcc-assignment-452211';
  const region = 'us-central1';
  const zone = 'us-central1-a';
  const vmName = 'vm-one';
  const instanceGroupName = 'vm-instance-group';
  const machineType = 'e2-micro';
  const targetCpu = 70;
  const minInstances = 1;
  const maxInstances = 3;
  const targetTag = 'http-server';
  const serviceAccountEmail = '147388271762-compute@developer.gserviceaccount.com';

  // 1. Create Instance Template
  const templateName = `${vmName}-template`;
  const templateConfig = {
    name: templateName,
    properties: {
      machineType: machineType,
      tags: {
        items: [targetTag],
      },
    },
  };

  const [templateOperation] = await compute.instanceTemplates().insert(templateConfig, { project: projectId, region: region });
  await templateOperation.promise();
  console.log(`Instance template ${templateName} created.`);

  // 2. Create Managed Instance Group with Autoscaling
  const instanceGroupConfig = {
    name: instanceGroupName,
    region: region,
    baseInstanceName: vmName,
    instanceTemplate: templateName,
    autoscaler: {
      name: `${instanceGroupName}-autoscaler`,
      target: `projects/${projectId}/regions/${region}/instanceGroupManagers/${instanceGroupName}`,
      autoscalingPolicy: {
        cpuUtilization: {
          predictiveMethod: 'STANDARD',
          target: targetCpu / 100,
        },
        minReplicas: minInstances,
        maxReplicas: maxInstances,
      },
    },
  };


  const [instanceGroupOperation] = await compute.instanceGroupManagers().insert(instanceGroupConfig, { project: projectId, region: region });
  await instanceGroupOperation.promise();
  console.log(`Managed instance group ${instanceGroupName} created.`);


  // 3. Create Firewall Rule (Allow HTTP/HTTPS)
  const firewallRuleConfig = {
    name: 'allow-http-https',
    network: 'global/networks/default',
    allow: {
      TCP: ['80', '443'],
    },
    sourceRanges: ['0.0.0.0/0'],
    targetTags: [targetTag],
  };

  const [firewallOperation] = await compute.firewallRules().insert(firewallRuleConfig, { project: projectId });
  await firewallOperation.promise();
  console.log('Firewall rule created.');



  //4. IAM configuration
  const resource = `projects/${projectId}/zones/${zone}/instances/${vmName}`;
  const policy = {
    bindings: [
      {
        role: 'roles/compute.instanceAdmin.v1',
        members: [`serviceAccount:${serviceAccountEmail}`]
      }
    ]
  };

  try {
    const [setIamPolicyResponse] = await iam.setPolicy({ resource, policy });
    console.log("IAM policy set successfully", setIamPolicyResponse);
  } catch (error) {
    console.error("Error setting IAM policy:", error);
  }

  console.log('VM instance and autoscaling configuration complete.');

}


createScalableVM();