/**
 * element-ui上传
 * @param action
 * @param option
 * @param xhr
 * @returns {Error}
 */

function getError(action, option, xhr) {
    var msg;
    if (xhr.response) {
        msg = xhr.response.error || xhr.response;
    } else if (xhr.responseText) {
        msg = xhr.responseText;
    } else {
        msg = "fail to post" + action + xhr.status;
    }

    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'post';
    err.url = action;
    return err;
}

function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

/**
 *upload：返回上传文件存储服务器地址（提供默认上传进度展示）
 *options：对象包括
 *url：服务请求url
 *data：上传数据，
 *async：是否异步，默认false
 *headers:请求头，若没有取默认的
 */
var upload = function(options) {
    var settings={
        headers:{
            'Authorization':'Bearer '+yufp.service.getToken()
        },
        method:'post',
        async:true,
        data:[],
        onError:function(e){
            yufp.$message("请求发生错误!","警告");
        },
        onSuccess:function(e){
            yufp.$message("请求成功!","提示");
        },
        onProgress:function(e){

        }
    };

    var url="";
    if(options.url){
        url=options.url;
        if(!url.indexOf("http")>-1){
            // 当不包含http时拼接gateway地址
            url=yufp.service.getUrl({url:url});
        }
    }else{
        yufp.$message("必须设置请求url!","警告");
        return;
    }

    var addDefault=function(target,src){
        yufp.extend(true,src,target);
        return src;
    };

    options=addDefault(options,settings);

    var xhr=null;
    if(window.XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else if(window.ActiveXObject){
        xhr=new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        yufp.$message("你的浏览器不支持XMLHttp!","提示");
        return;
    }

    if(xhr.upload){
        // 上传进度监控
        xhr.upload.onProgress=function(e){
            if(e.total>0){
                e.percent=e.loaded/e.total*100;
            }
            options.onProgress(e);
        };
    }

    // 下载数据成功调用
    xhr.onload=function(){
        if(xhr.status<200||xhr.status>300){
            return options.onError();
        }
        options.onSuccess(xhr);
    };

    // 网络发生异常时触发
    xhr.onerror=function(e){
        options.onError(e);
    };

    var method="post";
    if((options.method).toLowerCase()=="get"){
        method="get";
    }
    xhr.open(method,url,options.async);

    if(options.headers){
        if(typeof(options.headers)=="object"){
            var _headers=options.headers;
            for(var key in _headers){
                xhr.setRequestHeader(key,_headers[key]);
            }
        }else{
            yufp.$message("请求头必须为Object!","警告");
        }
    }

    //仅为post才能传递
    var formdata=new FormData();
    if(options.data){
        var _data=options.data;
        for(var i in _data){
            var obj=_data[i];
            if(obj.name&&obj.name!="file"){
                formdata.append(obj.name,obj.value);
            }else{
                formdata.append("file",obj.value);
            }
        }
    }

    xhr.send(formdata);
    return xhr;
};

//文件上传

var ajax=function(options){
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window._ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xhr == null) {
        yufp.$message("你的浏览器不支持XMLHttp!");
    }

    var url=options.url
    var formData = new FormData();
    if(options.data){
        var t=options.data.concat();
        for(var i in t){
            formData.append('file',t[i].value);
        }
    }
    xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
            return options.failure(getError(url, options, xhr));
        }

        options.success(getBody(xhr));
    };

    xhr.open('post', url, true);

    xhr.send(formData);
    return xhr;
};




