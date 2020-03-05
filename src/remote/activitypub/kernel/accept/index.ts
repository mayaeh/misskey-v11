import Resolver from '../../resolver';
import { IRemoteUser } from '../../../../models/user';
import acceptFollow from './follow';
import { IAccept, IFollow } from '../../type';
import { apLogger } from '../../logger';

const logger = apLogger;

export default async (actor: IRemoteUser, activity: IAccept): Promise<string> => {
	const uri = activity.id || activity;

	logger.info(`Accept: ${uri}`);

	const resolver = new Resolver();

	let object;

	try {
		object = await resolver.resolve(activity.object);
	} catch (e) {
		logger.error(`Resolution failed: ${e}`);
		throw e;
	}

	switch (object.type) {
	case 'Follow':
		return await acceptFollow(actor, object as IFollow);

	default:
		return `skip: Unknown accept type: ${object.type}`;
	}
};
