import { IRemoteUser, isLocalUser } from '../../../../models/user';
import { IBlock } from '../../type';
import unblock from '../../../../services/blocking/delete';
import ApResolver from '../../ap-resolver';

export default async (actor: IRemoteUser, activity: IBlock): Promise<string> => {
	const apResolver = new ApResolver();
	const blockee = await apResolver.getUserFromObject(activity.object);

	if (blockee == null) {
		return `skip: blockee not found`;
	}

	if (!isLocalUser(blockee)) {
		return `skip: ブロック解除しようとしているユーザーはローカルユーザーではありません`;
	}

	await unblock(actor, blockee);
	return `ok`;
};
