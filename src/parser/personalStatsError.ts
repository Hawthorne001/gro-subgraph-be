import {
    Status,
    NetworkName
} from '../types';
import { 
    emptyEthUser, 
    emptyAvaxUser
} from './personalStatsEmpty';
import { IPersonalStatsTotals} from '../interfaces/IPersonalStats';


const emptyTotals = {
    'ethereum': 'N/A',
    'avalanche': 'N/A',
    'total': 'N/A'
}

export const personalStatsError = (
    currentTimestamp: string,
    address: string,
): IPersonalStatsTotals => {
    return {
        'gro_personal_position_mc': {
            'status': Status.ERROR,
            'current_timestamp': currentTimestamp,
            'address': address,
            'network': NetworkName.MAINNET,
            'mc_totals': {
                'amount_added': emptyTotals,
                'amount_removed': emptyTotals,
                'net_amount_added': emptyTotals,
                'current_balance': emptyTotals,
                'net_returns': emptyTotals
            },
            'ethereum': emptyEthUser(currentTimestamp, address, Status.ERROR),
            'avalanche': emptyAvaxUser(Status.ERROR)
        }
    }
}
