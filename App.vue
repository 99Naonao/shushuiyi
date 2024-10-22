<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import 'common/uni.css';

	page {
		width: 100%;
		height: 100%;
	}

	view {
		display: block;
	}

	.flex1 {
		flex: 1;
	}

	.flex {
		display: flex;
	}

	.space-round {
		justify-content: space-around;
	}

	.space-between {
		justify-content: space-between;
	}

	.just-center {
		justify-content: center;
	}

	.align-center {
		align-items: center;
	}
</style>