export default class BaseResult{


    constructor({code, status, message, data}){
        //code
        this.code = typeof(code) == 'undefined' ? 0 : code;
        //status
        this.status = typeof(status) == 'undefined' ? 'success' : status.toString();
        //message
        this.message = typeof(message) == 'undefined' ? '' : message;
        //status
        this.data = typeof(data) == 'undefined' ? '' : data;
    }

    setData(data){
        this.data = typeof(data) == 'undefined' ? '' : data;
    }
}