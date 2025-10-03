export default class Module{
    constructor(code, cliteral, vliteral, courseId){
        this.code = code;
        this.cliteral = cliteral;
        this.vliteral = vliteral;
        this.courseId = courseId;
    }
    toString(){
        return `Module {code: ${this.code}, cliteral: ${this.cliteral}, vilteral: ${this.vliteral}, courseId: ${this.courseId}}`;
    }
}