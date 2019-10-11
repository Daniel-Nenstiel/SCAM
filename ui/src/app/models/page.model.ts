export class Page {
    externalPaging: boolean
    count?: number
    offset?: number
    limit?: number
    
    /**
     * @param extPage Determines whether paging will be done serverside or clientside
     */
    constructor(extPage: boolean) {
        this.externalPaging = extPage
        if(extPage) {
            this.count = 0;
            this.offset = 0;
            this.limit = 10;
        }
    }
}
