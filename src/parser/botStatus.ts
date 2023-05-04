import { showError } from '../handler/logHandler';
import {
    Status,
    NetworkId,
} from '../types';
import {
    IBotStatus,
    IBotStatusNetwork,
} from '../interfaces/botStatus/IBotStatus';
import {
    IBotStatusCall,
    IBotStatusCallError,
} from '../interfaces/subgraphCalls/IBotStatusCall';
import {
    botStatusError,
    botStatusNetworkError,
} from './botStatusError';


// Type guard to check if the object is of type IBotStatusCallError
function isBotStatusCallError(status: IBotStatusCall): status is IBotStatusCallError {
    return 'errors' in status;
}

/// @notice Parses a given bot status call and returns the corresponding bot status network
/// @param status The IBotStatusCall object to parse
/// @param networkId The NetworkId for the given status object
/// @return An IBotStatusNetwork object containing the parsed status information
const parseStatus = (
    status: IBotStatusCall,
    networkId: NetworkId
): IBotStatusNetwork => {
    if (isBotStatusCallError(status)) {
        return botStatusNetworkError(status.errors, networkId);
    }
    if (!status.data) {
        return botStatusNetworkError('Missing data from subgraph', networkId);
    }
    if (status.data._meta.hasIndexingErrors) {
        return botStatusNetworkError('Subgraph has indexing errors', networkId);
    }
    return {
        'status': Status.OK,
        'error_msg': '',
        'network_id': status.data.masterDatas[0].network_id,
        'has_indexing_errors': status.data._meta.hasIndexingErrors,
        'launch_timestamp': status.data.masterDatas[0].launch_timestamp,
        'block_number': status.data._meta.block.number,
    };
}

/// @notice Parses the bot status call of two given networks and returns a combined bot status
/// @param statusEth The bot status call object for Ethereum
/// @param statusAvax The bot status call object for Avalanche
/// @return An IBotStatus object containing the combined status of both networks
export const botStatusParser = (
    statusEth: IBotStatusCall,
    statusAvax: IBotStatusCall,
): IBotStatus => {
    try {
        const ethResult = parseStatus(statusEth, NetworkId.MAINNET);
        const avaxResult = parseStatus(statusAvax, NetworkId.AVALANCHE);
        const result = {
            'bot_status': {
                'status': (ethResult.status === Status.OK && avaxResult.status === Status.OK) ? Status.OK : Status.ERROR,
                'error_msg': '',
                'network': {
                    [NetworkId.MAINNET]: ethResult,
                    [NetworkId.AVALANCHE]: avaxResult,
                }
            }
        }
        return result;
    } catch (err) {
        showError('botStatus.ts->botStatusParser()', err);
        return botStatusError(err as string);
    }
}
