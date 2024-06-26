import {
  Deployment,
  KeypairType,
  SignatureRequest,
  SignatureRequirement,
  Workload,
  WorkloadTypes,
} from '@threefold/grid_client';
import { Zmount } from '../types/zmount';
import { grid } from '../utils/grid';
import {
  ComputeCapacity,
  Mount,
  Zmachine,
  ZmachineNetwork,
} from '../types/zmachine';
import { Znet } from '../types/znet';
import * as config from '../config.json';

const zmount = new Zmount();
zmount.size = 10000000000;

const disk = new Workload();
disk.version = 0;
disk.name = 'zdisk';
disk.description = '';
disk.metadata = '';
disk.type = WorkloadTypes.zmount;
disk.data = zmount;

const znet = new Znet();
znet.subnet = '10.20.2.0/24';
znet.ip_range = '10.20.0.0/16';
znet.wireguard_private_key = '4nQJ3uZetD1wBztUIAFLbybqKqGxpmYjYoIgjqe3PXY=';
znet.wireguard_listen_port = 20520;
znet.peers = [];

const network = new Workload();
network.version = 0;
network.type = WorkloadTypes.network;
network.name = 'znetwork';
network.description = '';
network.data = znet;
network.metadata = JSON.stringify({ version: 3, user_accesses: [] });

const vmNetwork = new ZmachineNetwork();
vmNetwork.planetary = true;
vmNetwork.interfaces = [
  {
    network: network.name,
    ip: '10.20.2.2',
  },
];
vmNetwork.public_ip = '';

const compute_capacity = new ComputeCapacity();
compute_capacity.cpu = 1;
compute_capacity.memory = 1000000000;

const diskMount = new Mount();
diskMount.name = 'zdisk';
diskMount.mountpoint = '/mnt/data';

const zmachine = new Zmachine();
zmachine.flist = 'https://hub.grid.tf/tf-official-vms/ubuntu-22.04.flist';
zmachine.network = vmNetwork;
zmachine.size = 100000000000;
zmachine.mounts = [diskMount];
zmachine.entrypoint = '/sbin/zinit init';
zmachine.compute_capacity = compute_capacity;
zmachine.env = {
  SSH_KEY: config.ssh_key,
};
zmachine.corex = false;
zmachine.gpu = [];

const vm = new Workload();
vm.version = 0;
vm.name = 'zeeVM';
vm.description = '';
vm.metadata = '';
vm.type = WorkloadTypes.zmachine;
vm.data = zmachine;

const signature_request = new SignatureRequest();
signature_request.twin_id = config.twin_id;
signature_request.weight = 1;
signature_request.required = false;

const signature_requirement = new SignatureRequirement();
signature_requirement.weight_required = 1;
signature_requirement.requests = [signature_request];

const deployment = new Deployment();
deployment.version = 0;
deployment.twin_id = config.twin_id;
deployment.metadata = '';
deployment.description = '';
deployment.expiration = 0;
deployment.workloads = [disk, network, vm];
deployment.signature_requirement = signature_requirement;

(async function () {
  await grid.connect();
  const hash = deployment.challenge_hash();

  const contract = await (
    await grid.tfclient.contracts.createNode({
      hash,
      numberOfPublicIps: 0,
      nodeId: 11,
      solutionProviderId: 1,
      data: JSON.stringify({
        version: 3,
        type: 'vm',
        name: `${vm.name}`,
        projectName: `vm/${vm.name}`,
      }),
    })
  ).apply();

  deployment.contract_id = contract.contractId;
  deployment.sign(config.twin_id, config.mnemonic, KeypairType.sr25519);

  await grid.tfclient.connect();
  await grid.rmbClient.connect();

  const deployMsgId = await grid.rmbClient.send(
    'zos.deployment.deploy',
    JSON.stringify(deployment),
    21,
    1,
    3
  );

  await grid.rmbClient.read(deployMsgId);

  setTimeout(async () => { }, 10000);

  const msg = await grid.rmbClient.send(
    'zos.deployment.get',
    JSON.stringify({ contract_id: deployment.contract_id }),
    21,
    1,
    3
  );

  const msgReply = await grid.rmbClient.read(msg);
  console.log('msgReply: ', msgReply);

  await grid.disconnect();
})();
