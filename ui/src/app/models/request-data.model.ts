export class RequestData {
    table: {[prefix: string]: string}
    body?: any|any[]; 
    params?: Map<string, string|number|null>;
    query?: {
        limit?: number;
        offset?: number;
        filter?: RequestFilter| RequestFilter[]
        checksum?: string;
        lock?: boolean;
        force_null?: boolean
    };
}

export class RequestFilter {    
    key: string;
    value: string|number|Date;
    type:   |'After'
            |'AfterInclusive'
            |'Before'
            |'BeforeInclusive'
            |'Contains'
            |'Equal'
            |'ExactMatch'
            |'Greater'
            |'GreaterEqual'  
            |'Less'
            |'LessEqual'
            |'NotContain'
            |'Not'
}