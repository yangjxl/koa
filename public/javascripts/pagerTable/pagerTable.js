/**
HTML所需：
<div id="i90"></div>

JS调用方式：
$('#i90').pagerTable({
	url: './data.js',
	type: 'get',
	data: {
		pageNum: 1,
		pageSize: 10
	},
	captains: 'ID 姓名 工号',
	bodyData: 'userId userName level',
	then: function(){}//加载完DOM后，最后执行
})

	//如果需要对返回数据进行组合，可在回调中，操作数据
	bodyData: function(ret){
		
	}
注：bodyData： 
		string : 'userId userName level'
		 array : ['userId', 'userName', 'level']
	  function : function(data){
	  	var html = '';
		$.each(data, function(i,v){
			html += '<tr id="'+v.id+'"><td><div class="checkbox"><label><input type="checkbox" value="'+v.id+'"></label></div></td>';
			html += '<td>'+v.userId+'</td><td>'+v.userName+'</td><td>'+v.level+'</td>'
			html += '</tr>';
		})
		return html;
	}
 */
~(function(window, $){
	var vs = '17.1.16',
	author = 'zhangzw';
	
	var _default = {
		type: 'get',
		data: {
			pageNum: 1,
			pageSize: 10
		},
		checkable: true//是否显示checkbox
		,fixCurPage: 0//curPage = curPage + fixCurPage
		//url: '',
		//captains: [],
		//bodyData: [] | '' | func
	}
	var ajax = function(params, fn){
		$.ajax({
			url: params.url,
			type: params.type,
			data: params.data,
			dataType: 'json',
			success: function(ret){
				if(typeof data === 'string'){
					ret = JSON.parse(ret)
				}
				if(ret.message === '成功'){
					if(fn) fn({data: ret.data.content, page: ret.data})
				}else{
					console.error(ret.status+' : '+ret.errorMsg)
				}
			},
			error: function(){
				console.error('ajax-error')
			}
		})
	}
	
	
	var tmpl = {
		thead: function(data, opt){
			var captains = data;
			var html = opt.checkable ? '<th class="first_th"><div class="checkbox"><label><input type="checkbox" value="" id="check_all"></label></div></th>': '';
			if(typeof captains === 'string')
				captains = captains.split(' ')
			if(captains instanceof Array && captains.length){
				$.each(captains, function(i ,v){
					html += '<th>'+v+'</th>';
				});
			}
			return '<tr>'+html+'</tr>';
		},
		tbody: function(data, opt){
			var keys = opt.bodyData;
			if(typeof keys === 'function'){
				return keys(data) || '';
				/*var html = '';
				$.each(data, function(i,v){
					html += '<tr id="'+v.id+'"><td><div class="checkbox"><label><input type="checkbox" value="'+v.id+'"></label></div></td>';
					$.each(keys(v), function(ii, k){
						html+= '<td>'+k+'</td>'
					})
					html += '</tr>';
				})
				return html;*/
			}else{
				// console.info('[pagerTable.js]请求返回数据', data)
				if(typeof keys === 'string'){
					keys = keys.split(' ')
				}else if(typeof keys === 'undefined'){
					keys = []
				}
				var html = '';
				$.each(data, function(i ,v){
					html += '<tr id="'+v.id+'">';
					if(opt.checkable)
						html += '<td><div class="checkbox"><label><input type="checkbox" value="'+v.id+'"></label></div></td>';
					$.each(keys, function(ii, k){
						html+= '<td>'+v[k]+'</td>'
					})
					html += '</tr>';
				})
				return html;
			}
		},
		table: function(data, opt){
			var html = '';
			html += '<table class="table table-striped table-bordered table-hover">';
			html += '<thead>'+this.thead(opt.captains, opt)+'</thead>';
			html += '<tbody>'+this.tbody(data, opt)+'</tbody>';
			html += '<tfoot></tfoot>'
			html += '</table>';
			return html;
		},
		pager: function(ret, opt){
			var
			data = ret.page,
			hasData = ret.data && ret.data.length;
			//fix
			console.log(data)
			data.number = data.number + 1 + opt.fixCurPage;
			// console.log(data.number+"======="+data.totalPages);
			var
			unPrev = data.number <= 1,
			unNext = data.number >= data.totalPages;
			
			var html = '';
			if(hasData){
				html += '<div class="ovh">';
				html += '<span class="fl">共 <span class="total">'+data.totalElements+'</span> 条数据</span>';
				html += '<span class="fr">';
				if(!unPrev)
					html += '<a href="javascript:;" class="dt-prev">上一页</a>　';
				html += '第 <span class="curPage">'+data.number+'</span>/<span class="totalPage">'+data.totalPages+'</span> 页';
				if(!unNext)
					html += '<a href="javascript:;" class="dt-next">下一页</a>';
				html += '</span></div>';
			}else{
				html += '<div class="nodata_p">无数据</div>';
			}
			return html;
		}
	}
	
	var init = function(options){
		var options = $.extend(_default, options);

		ajax(options, function(ret){
			//init table
			var table = tmpl.table(ret.data, options);
			//init pager
			var pager = tmpl.pager(ret, options);
			
			options._this.html(table + pager)
			
			//最后执行
			if(options.then) options.then()
			
		});
	}
	var doPage = function(type, options){
		//获取当前是第几页
		var curPage = $.trim(options._this.find('.curPage').text());
		//查询第几页
		var toPage = type>0 ? ++curPage : --curPage;
		options.data.pageNum = toPage;
		console.log(options.data);
		//初始化
		init(options)
	}

	$.fn.extend({
		pagerTable: function(options){
			//+ attr
			options.id = this.selector;
			window.selectorId = this.selector;
			options._this = $(this);
			//初始化
			init(options)

			$(document)
			.off('click', options.id+' .dt-prev')
			.off('click', options.id+' .dt-next')
			.off('click', options.id+' input:checkbox')
			//上一页
			.on('click', options.id+' .dt-prev', function(){
				doPage(-1, options)
			})
			//下一页
			.on('click', options.id+' .dt-next', function(){
				doPage(1, options)
			})
			//checkbox
			.on('click', options.id+' input:checkbox', function(){
				var isAll = $(this).attr('id');
				if(isAll){
					if (this.checked) {
						$(options.id+' tbody :checkbox').prop("checked", true);
					} else {
						$(options.id+' tbody :checkbox').prop("checked", false);
					}
				}else{
					var chknum = $(options.id+'tbody :checkbox').size();//选项总个数
					var chk = 0;
					$(options.id+'tbody :checkbox').each(function () {
						if ($(this).prop("checked") == true) {
							chk++;
						}
					});
					if (chknum == chk) { //全选 
						$(options.id+'#check_all').prop("checked", true);
					} else { //不全选 
						$(options.id+'#check_all').prop("checked", false);
					}
				}
			})
		}
	})
})(window, jQuery);

//12.23.1 - curPage<=0时 默认=1
//12.27.1 - 屏蔽undefined
//12.28.1 - curPage++
//17.1.5  - fixCurPage
//17.1.12 - then()//加载完DOM后，最后执行
//17.1.16 - 去掉本页