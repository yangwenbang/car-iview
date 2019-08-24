<template>
  <div>
    <div class="cfile">
      <div class="ct">
        <div class="it" v-for="item in datas" :key="item.index">
          <div class="ii">
            <img v-if="item.imgPath" :src="item.imgPath">
          </div>
          <div :class="[ 'lb', {'lh': item.imgPath.length!=0}]">
            <div class="pt">
              <button @click="selectFiles(item)">上传</button>
            </div>
            <input
              class="sf"
              :id="item.htmlid"
              type="file"
              accept="image/x-png, image/gif, image/jpeg, image/bmp"
            >
          </div>
          <div :class="[ 'lo', {'lh': item.imgPath.length==0}]">
            <div class="pt">
              <button @click="selectFiles(item)">重传</button>
              <button v-if="item.index==0" @click="deleteFirst(item)">删除</button>
              <button v-if="item.index>0" @click="deleteItem(item)">删除</button>
            </div>
          </div>
        </div>
        <div class="zt" v-if="datas.length<4">
          <button @click="addpic">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {uploadImg} from "@/api/commodity";
import {guid} from "@/libs/util";

export default {
  name: "ImgUpload",
  props: {
    // 总条数
    imgPath: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      htmlid: "",
      datas: [
        {
          imgPath: "",
          index: 0,
          htmlid: guid()
        }
      ],
      index: 1,
      img: {
        path: "",
        urlPath: ""
      }
    };
  },
  created() {
    this.setId();
  },
  watch: {
    imgPath: function(n, o) {
      if (n == null) {
        this.datas = [
          {
            imgPath: "",
            index: 0,
            htmlid: guid()
          }
        ];
      } else {
        if (n.length > 0) {
          if (n == ",") {
            this.datas = [
              {
                imgPath: "",
                index: 0,
                htmlid: guid()
              }
            ];
          } else {
            this.parseImg();
          }
        } else {
          this.datas = [
            {
              imgPath: "",
              index: 0,
              htmlid: guid()
            }
          ];
        }
      }
    }
  },
  methods: {
    parseImg() {
      var imgDatas = this.imgPath.split(",");
      this.datas = [];
      for (var i = 0; i < imgDatas.length; i++) {
        var element = imgDatas[i];
        if (element.length > 7) {
          var p = 0;
          if (element.indexOf("JX-IMG-") > -1) {
            p = 7;
          }
          var path = element.substring(p, element.length);
          if(!(path.indexOf("http://") > -1)) {
              path = "http://" + path;
          }
          console.log(path);
          if (path.length > 20) {
            var item = {
              urlPath: path,
              imgPath: path,
              index: i,
              htmlid: guid()
            };
            this.datas.push(item);
          }
        }
      }
    },
    setId() {
      debugger
      this.htmlid = guid();
    },
    addpic() {
      var lastItem = this.datas[this.datas.length - 1];
      this.datas.push({
        imgPath: "",
        htmlid: guid(),
        index: lastItem.index + 1
      });
    },
    deleteFirst(item) {
      item.imgPath = "";
      item.urlPath = "";
      console.log(this.datas);
      this.$emit("change", this.datas);
    },
    deleteItem(item) {
      this.datas.splice(item.index, 1);
      for (var i = 0; i < this.datas.length; i++) {
        this.datas[i].index = i;
      }
    },
    selectFiles(item) {
      let that = this;
      let id = "#" + item.htmlid;
      $(id).trigger("click");
      $(id).on("change", function() {
        var file = $(id)[0].files[0];
        var reg = /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/;
        var check = reg.test(file.name);
        if (!check) {
          util.alert("请上传图片类型文件");
        } else {
          that.preview(item, file);
          that.uploadFile(item, file);
        }
      });
    },
    uploadFile(item, file) {
      var that = this;
      let param = new FormData(); // 创建form对象
      param.append("file", file, file.name); // 通过append向form对象添加数据
      param.append("chunk", "0"); // 添加form表单中其他数据
      uploadImg(param).then(response => {
        var rdata = response.data;
        if (rdata.code == 200) {
          item.urlPath = rdata.data;
          that.$emit("change", that.datas);
          this.$message({
            message: "图片上传成功",
            type: "success"
          });
        } else {
          this.$message.error("图片上传失败" + rdata.msg);
        }
      });
    },
    preview(item, file) {
      var read = new FileReader(); // 创建FileReader对像;
      read.readAsDataURL(file); // 调用readAsDataURL方法读取文件;
      let that = this;
      read.onload = function() {
        var url = read.result; // 拿到读取结果;
        var img = new Image();
        item.imgPath = url;
        item.imgPath = url;
      };
    }
  }
};
</script>
<style scoped>
.cfile {
  position: relative;
  margin-bottom: 0px;
  width: 800px;
  height: 100px;
}
.cfile .ct {
  position: relative;
  float: left;
  height: 100px;
}
.cfile .it {
  position: relative;
  float: left;
  width: 100px;
  height: 100px;
  margin-right: 10px;
}

.cfile .it .lb {
  position: absolute;
  float: left;
  z-index: 10;
  left: 0px;
  top: 0;
}
.cfile .it .lb .pt {
  position: absolute;
  top: 0px;
  width: 100px;
  height: 100px;
  left: -1px;
  text-align: center;
  background: #ddd;
  border: solid 1px #ddd;
  border-radius: 3px;
}
.cfile .it .lb .pt button {
  cursor: pointer;
  border: solid 1px rgba(251, 198, 71, 1);
  background: rgba(251, 198, 71, 1);
  border-radius: 2px;
  font-size: 12px;
  color: #fff;
  margin-top: 40px;
}

.cfile .ct .zt {
  position: absolute;
  float: left;
  z-index: 10;
  right: -15px;
  bottom: 0;
}

.cfile .zt button {
  cursor: pointer;
  border: solid 1px rgba(251, 198, 71, 1);
  background: rgba(251, 198, 71, 1);
  border-radius: 2px;
  font-size: 13px;
  margin-top: 40px;
  color: #fff;
}

.cfile .lo {
  position: absolute;
  float: left;
  z-index: 10;
  left: 0px;
  top: 0;
  opacity: 0;
}
.cfile .lo:hover {
  opacity: 0.8;
}
.cfile .lo .pt {
  position: absolute;
  top: 0px;
  height: 100px;
  width: 100px;
  left: -1px;
  text-align: center;
  background: #ddd;
  border: solid 1px #ddd;
  border-radius: 3px;
}
.cfile .lo .pt button {
  cursor: pointer;
  border: solid 1px rgba(251, 198, 71, 1);
  background: rgba(251, 198, 71, 1);
  border-radius: 2px;
  font-size: 12px;
  margin-top: 40px;
  color: #000;
}

.c .lh {
  display: none;
}

.cfile .lt {
  height: 100px;
  width: 100px;
  font-size: 30px;
  text-align: center;
  color: #333;
  background: #f2f2f2;
  cursor: pointer;
  border: none;
}

.cfile .sf {
  display: none;
}

.cfile .ii {
  display: inline-block;
  height: 100px;
  width: 100px;
  font-size: 40px;
  line-height: 100px;
  text-align: center;
  color: #fff;
  background: #ddd;
  cursor: pointer;
  border: solid 1px #ddd;
  border-radius: 3px;
}

.cfile .ii img {
  width: 100px;
  height: 100px;
  border-radius: 3px;
}
</style>
