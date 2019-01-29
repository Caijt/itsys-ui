<template>
	<div>
		<div class='demo-bg'>
			<el-row>
				<el-col :lg='{span:18,offset:3}' :sm='{span:20,offset:2}' :xs='{span:21,offset:1}'>
					<div style='text-align: center' class="actor">Hello,IT </div>
					<h1 class='demo-title'>IT部门信息管理系统</h1>
					<p class='demo-sub-title' style='margin:20px 0px 30px;'>IT资产管理 ● 合同管理 ● 网络结构管理 ● 供应商管理 ● 账号管理</p>
					
					<div style='padding:20px 0px'>
						<el-button round size='big'  type='success' @click='$router.push("/login")'>我要体验</el-button>
						<el-button round size='big' type='primary' @click='download'>我要下载</el-button>
					</div>
					<div style='margin:20px 0px 0px'>
						很高兴你能看到我做的这个IT部门信息管理系统，希望我做的系统能对你的工作有所帮助。
					</div>
				</el-col>
			</el-row>
		</div>
		<div style='padding:40px 0px;color:#303133'>
			<el-row>
				<el-col :lg='{span:18,offset:3}' :sm='{span:20,offset:2}' :xs='{span:21,offset:1}'>
					<div class='demo-section'>
						<divider class='demo' >自我介绍</divider>
						<div class='demo-text'>
							我姓蔡，我喜欢别人叫我蔡工，听起来特别有技术含量的感觉，我是一个企业的小网管，一个很喜欢技术的IT男，为了更方便的管理企业的IT资产，我开始了自学软件开发，这是我开发的第5版IT系统了，从第一版winform的CS版本，第二版的.net BS版本的，第三版的easyui+.net，第四版用的bootstrap+php，到现在的vue+tp5，每个版本功能上都有所进步，技术选型上也有所进步，感谢<a href='https://cn.vuejs.org/' target="_blank">vue</a>这个伟大的前端框架，让我这个写前端痛苦的人可以那么快乐的写前端。
						</div>		
					</div>
					<div class='demo-section'>
						<divider class='demo'>系统介绍</divider>
						<div style='font-size: 18px;font-weight: bold'>IT资产管理</div>
						<div class='demo-text'>
							IT资产管理功能包含了入库、领用、交还、维修、报废、标签打印、领用交还单打印、库存预警等功能。
						</div>
						<div>
							<img src='./img1.jpg' width="100%" />
						</div>
						<div style='font-size: 18px;font-weight: bold'>部门合同、账号、网络结构、供应合作商管理</div>
						<div class='demo-text'>
							集成了IT部门中其它的业务功能。
						</div>
						<div>
							<img src='./img2.jpg' width="100%" />
						</div>
						<div style='font-size: 18px;font-weight: bold'>系统后台设置</div>
						<div class='demo-text'>
							系统以传统的用户角色进行菜单权限的管理，以公司为单位进行数据权限的划分，可实现不同的管理人员管理各自公司的资产数据，适用于集团公司等多公司的复杂的企业资产管理情况。
						</div>
						<div>
							<img src='./img3.jpg' width="100%" />
						</div>
					</div>
					<div class='demo-section'>
						<divider class='demo' >系统部署教程</divider>
						<div class='demo-text'>
							首先得搭建个php的环境，如果你是window下的话，很简单，去下载个<a href='http://phpstudy.php.cn/' target="_blank">phpStudy</a>，php版本选择5.4.45，打开站点域名管理，添加一个目录后，记得点击保存设置并生成配置文件，然后在上面把IT系统下载下来，解压后，放在刚才那个刚添加的站点域名目录下。教程完善中。。。
						</div>		
					</div>
					<!-- <div>
						我想聊聊我在做这个系统的IT资产管理功能一个特别让我纠结的地方，IT资产主要可分成大件资产（类似电脑、显示器，一个资产记录只有1个数量）、零散资产（类似一些耗材、鼠标键盘、数据线、U盘，一个资产记录可能有多个数量），但同一类型的资产又可以属于零散资产，也可以属于大件资产，例如键盘，普通办公键盘可做为零散资产，但一个很贵的机械键盘也可做为大件资产，	这两种类型的资产的领用方式是不一样的，大件资产都是一个员工领用，零散资产都是由多个不同员工分别领用，在我前两版的IT系统中，我都没有考虑到零散资产领用的特殊性，结果在实际工作中用起来很不方便，在我第三版的系统中，我在IT资产上创建一个领用方式的字段进行区分，分别为单人领用、多人领用。但久而久之，我发现还是有问题，例如某天某员工申请了5个U盘用来送客人，那只有一个人领用，那很自然就选择了单人领用方式，但隔天员工拿回一个U盘，说是多出的，那不就得重新进行，这不应该是由录入人员去判断的，在这版系统，全部资产只要数量大于1的都是可以由多个员工领用，这样就不用录入人员再去判断用什么领用方式。
					</div> -->
				</el-col>
			</el-row>
		</div>
		<div style='background-color: #101010;color:#9d9d9d; text-align: left;padding:50px 0;'>
			<el-row>
				<el-col :lg='{span:18,offset:3}' :sm='{span:20,offset:2}' :xs='{span:21,offset:1}'>
					<el-row :gutter='10'>
						<el-col :span='14' :xs='{span:24}' style='line-height: 2'>
							如果你对系统有什么建议或者一些更好的想法都可以联系我。
							<br/>
							姓名：蔡工
							<br/>
							邮箱：59001731@qq.com
							<div style="margin: 40px 0 40px">
								<a href='http://www.miitbeian.gov.cn/' class='c-link' target="_blank">粤ICP备14002271号-2</a>
							</div>
						</el-col>
						<el-col :span='10' :xs='{span:24}'>
							<div>
								当然如果你觉得系统做的还行，一定要通过某种很俗很让人兴奋的方式（钱）支持鼓励我的话也是可以的，哈哈哈！
							</div>
							<div style='margin-top: 15px;text-align: center;'>
								<el-row>
									<el-col :span='12'>
										<img style='width:120px' src='./wx.jpg'/>
										<div>微信鼓励</div>
									</el-col>
									<el-col :span='12'>
										<img style='width:120px' src='./zfb.jpg'/>
										<div>支付宝鼓励</div>
									</el-col>
								</el-row>
								
								
							</div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>
		 
	</div>
</template>
<script>
	export default{
		data(){
			return {}
		},
		methods:{
			download(){
				this.$message.success('目前系统还有一些细节方面需要再完善完善，请再等待一些时间...')
			}
		}
	}
</script>
<style lang='less'>
	.demo-bg {
		position: relative;
		padding: 130px 0px 80px;
		color: #fff;
	 	text-align: center;
		text-shadow: 0 1px 3px rgba(0,0,0,.4),0 0 30px rgba(0,0,0,.075);
		background: #020031;
		background: -moz-linear-gradient(45deg,#020031 0,#6d3353 100%);
		background: -webkit-gradient(linear,left bottom,right top,color-stop(0%,#020031),color-stop(100%,#6d3353));
		background: -webkit-linear-gradient(45deg,#020031 0,#6d3353 100%);
		background: -o-linear-gradient(45deg,#020031 0,#6d3353 100%);
		background: -ms-linear-gradient(45deg,#020031 0,#6d3353 100%);
		background: linear-gradient(45deg,#020031 0,#6d3353 100%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#020031', endColorstr='#6d3353', GradientType=1);
		-webkit-box-shadow: inset 0 3px 7px rgba(0,0,0,.2),inset 0 -3px 7px rgba(0,0,0,.2);
		-moz-box-shadow: inset 0 3px 7px rgba(0,0,0,.2),inset 0 -3px 7px rgba(0,0,0,.2);
		box-shadow: inset 0 3px 7px rgba(0,0,0,.2),inset 0 -3px 7px rgba(0,0,0,.2);
		.demo .title{
			font-size:25px !important;
			margin-top: -15px !important;
		}
	}
	.demo-title{
			font-size:62px;
			margin-bottom: 0px;
		}
	.actor{
		font-size: 80px;
		min-height:65px;
	}
	.actor:after{
		content:"";
		width:6px;	
		height:70px;
		vertical-align:-5px;
		margin-left:5px;
		background-color:#fff;
		display:inline-block;
		animation:blink .4s infinite alternate;
		-webkit-animation:blink .4s infinite alternate;
	}
	.banner-desc{padding-top:110px;padding-left:30px;font-size:46px;position:relative;z-index:10}
	.banner-desc h2{font-size:72px;margin:0;color:#fff}
	.banner-desc p{font-size:14px;opacity:.8;width:420px;line-height:1.8;padding-left:3px}
	@keyframes blink{0%{opacity:0}to{opacity:1}}
	
	.demo-text{
		padding:15px 0;
		text-indent:2em;
		line-height: 2;
		div{
			margin-bottom: 10px
		}
	}
	.demo-section{
		padding:30px 0;
	}
	@media (max-width:768px){
		.demo-bg{
			.demo-title{
				font-size:42px;
			}
			.actor{
				font-size: 60px;
				min-height:65px;
			}
			.actor:after{
				width:6px;	
				height:55px;
				vertical-align:-5px;
			}
			.demo-sub-title{
				
			}
		}
		
	}
</style>