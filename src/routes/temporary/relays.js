
import { Relay } from "../../models/relay.js";

const relayRoute = {
    method: 'GET',
    path: '/temp/relays',
    handler: async (request, h) => {
        try {
            const relays = await Relay.findAll();
            return relays;
        } catch (error) {
            console.error('Error fetching relays:', error);
            return h.response('Internal Server Error').code(500);
        }
    }
};

export default relayRoute;
