export default class Module{
    constructor(code, cliteral, vilteral, courseId){
        this.code = code;
        this.cliteral = cliteral;
        this.vilteral = vilteral;
        this.courseId = courseId;
    }
    toString(){
        return `Module {code: ${this.code}, cliteral: ${this.cliteral}, vilteral: ${this.vilteral}, courseId: ${this.courseId}}`;
    }
}