import {
    Status,
    NetworkName,
} from '../types';
import {
    IGroStats,
    IGroStatsEthereum,
    IGroStatsAvalanche,
} from '../interfaces/groStats/IGroStats';


export const groStatsParser = (
    stats_eth: IGroStatsEthereum,
    stats_avax: IGroStatsAvalanche,
): IGroStats => {
    const result = {
        'gro_stats_mc': {
            'status': (
                stats_eth.status === Status.OK
                && stats_avax.status === Status.OK)
                ? Status.OK
                : Status.ERROR,
            'error_msg': '',
            'current_timestamp': stats_eth.current_timestamp,
            'network': NetworkName.MAINNET,
            'mc_totals': {
                'tvl': {
                    'mainnet': 'N/A',
                    'avalanche': 'N/A',
                    'total': 'N/A',
                }
            },
            'mainnet': stats_eth,
            'avalanche': stats_avax,
        }
    }
    return result;
}
