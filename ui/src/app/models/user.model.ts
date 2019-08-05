export class User {
    '_id': string;
    'arbitrary-number': number;
    'date-created': {
        '$date': number
    } | Date | number;
    'password': string;
    'username': string;
    'status': number;
    'profile'?: UserProfile
}

export class UserProfile {
    'address'?: {
        'city': string,
        'street': string,
        'state': string,
        'zip': number
    };
    'first-name': string;
    'last-name'?: string;
}