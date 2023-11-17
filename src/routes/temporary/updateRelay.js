import { Relay } from "../../models/relay.js";

const updateRelayRoute = {
  method: 'PUT',
  path: '/temp/relays/{id}',
  handler: async (request, h) => {
    const relayId = request.params.id;
    const { targetState } = request.payload;

    try {
      const relay = await Relay.findByPk(relayId);
      if (!relay) {
        return h.response('Relay not found').code(404);
      }

      relay.targetState = targetState;
      await relay.save();

      return { message: 'Relay updated successfully', relay };
    } catch (error) {
      console.error('Error updating relay:', error);
      return h.response('Internal Server Error').code(500);
    }
  }
};

export default updateRelayRoute;
