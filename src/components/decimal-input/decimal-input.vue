<template>
  <Input :style="newStyle" :type="type" v-model="newValue" @on-keyup="inputChanged($event)" @input="changeEmit($event)"/>
</template>

<script>
export default {
  name: 'weightInput',
  props: [
    "value",
    "newStyle",
    "type",
    "maxlength",
    "maxInt",
    "maxDecimal"
  ],
  data () {
    return {
      newValue:this.value
    }
  },
  methods: {
    inputChanged(e){
      let value = e.target.value;
      if(value){
        if (value != "" && value.substr(0, 1) == ".") {
          value = "";
        }
        //清除“数字”和“.”以外的字符
        value = value.replace(/[^\d.]/g, ""); 
        //只保留第一个. 清除多余的
        value = value.replace(/\.{2,}/g, "."); 
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        //只能输入四个小数12个整数
        // let reg = new RegExp("^(\-)*(\d+)\.(\d{0,"+this.maxDecimal+"}).*$","g");
        // value = value.replace(eval("/^(\-)*(\d+)\.(\d{0,"+this.maxDecimal+"}).*$/"), "$1$2.$3");
        if(this.maxDecimal == "4"){
          value = value.replace(/^(\-)*(\d+)\.(\d{0,4}).*$/, "$1$2.$3");
        }else if(this.maxDecimal == "2"){
          value = value.replace(/^(\-)*(\d+)\.(\d{0,2}).*$/, "$1$2.$3");
        }
        if (String(value).indexOf(".") < 0 && value != "") {
          if (value.substr(0, 1) == "0" && value.length == 2) {
            value = value.substr(1, value.length);
          }
        }
        if(String(parseInt(value)).length > this.maxInt){
          value = String(parseInt(value)).substr(0,this.maxInt) + (String(value).indexOf(".") >= 0 ? "."+String(value).split(".")[1] : "");
        }
      }
      
      this.newValue = value;
      this.$emit('input', this.newValue);
    },
    changeEmit($event){
      this.$emit('on-change',$event);
    }
  },
  mounted () {
    
  }
}
</script>

