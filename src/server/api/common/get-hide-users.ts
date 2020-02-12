import * as mongo from 'mongodb';
import Mute from '../../../models/mute';
import User, { IUser } from '../../../models/user';
import { unique } from '../../../prelude/array';

export async function getHideUserIds(me: IUser, includeSilenced = false, includeSuspended = true) {
	return await getHideUserIdsById(me ? me._id : null, includeSilenced, includeSuspended);
}

export async function getHideUserIdsById(meId?: mongo.ObjectID, includeSilenced = false, includeSuspended = true) {
	const [suspended, silenced, muted] = await Promise.all([
		includeSuspended ? (User.find({
			isSuspended: true
		}, {
			fields: {
				_id: true
			}
		})) : [],
		includeSilenced ? (User.find({
			isSilenced: true,
			_id: { $nin: meId ? [ meId ] : [] }
		}, {
			fields: {
				_id: true
			}
		})) : [],
		meId ? Mute.find({
			muterId: meId
		}) : Promise.resolve([])
	]);

	return unique(suspended.map(user => user._id).concat(silenced.map(user => user._id)).concat(muted.map(mute => mute.muteeId)));
}