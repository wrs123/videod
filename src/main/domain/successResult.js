import BaseResult from "./baseResult";

export default class successResult extends BaseResult{

    constructor(props, {code, status, message, data}){
        super(props)
    }
}