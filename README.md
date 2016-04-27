# scroll-paginator

滚动分页
```html


<div class="datalist"></div>


<script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="../src/scrollpaginator.js"></script>

<script>
    jQuery(document).ready(function () {
        var scrollPaginatorObj;

        var loaddata = function (page) {
            var parms = {};
            parms.currentPageNum = page || 1;
            parms.rowsOfPage = 5;

            if (!scrollPaginatorObj) {
                scrollPaginatorObj = new scrollPaginator($('.datalist'), {
                    height: 200,
                    onScrollBottomed: function (page) {
                        loaddata(page);
                    }
                });
            }
            scrollPaginatorObj.setCurrentPage(page);

            var url = 'http://10.8.101.20:8080/core/api/facegroup?' + Math.random();
            $.ajax({
                type: "get",
                url: url,
                data: parms || "",
                dataType: "json",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                success: function (data) {
                    if (data) {
                        var datalist=data.data;
                        try {
                            if(datalist && datalist.length>0){
                                $(datalist).each(function () {
                                    $("<div>").html(this.name).appendTo($('div.datalist'));
                                });
                            }else{
                                scrollPaginatorObj.haveData(false);
                            }
                        } catch (e) {
                            showError(e);
                        }
                    }


                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(errorThrown.message);
                }
            });
        }


        loaddata(1);


    });

</script>


 ```
 
 
 ##注意
 
 使用scrollTop的元素或上级元素处理display:none的状态下时,使用$.scrollTop(n)将会失效.
 所以当在bootstrap的模式窗口中使用滚动分布组件中,需要在modal.modal('show')后进入数据的延迟加载:
 
 ```html
    
    $('.modal').modal('show');
    setTimeout(function () {loaddata(1);},  500);
         
```