<script>
	import '../app.css';
	import { FlatToast, ToastContainer } from 'svelte-toasts';
</script>

<slot />

<ToastContainer placement="bottom-center" let:data>
	<FlatToast {data} />
</ToastContainer>
