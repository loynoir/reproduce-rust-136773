#![no_std]
#![no_main]

#[panic_handler]
pub fn unreachable_panic_handler(_info: &core::panic::PanicInfo) -> ! {
    core::arch::wasm32::unreachable()
}

#[unsafe(no_mangle)]
pub extern "C" fn core_panic() -> ! {
    core::panic!()
}

#[unsafe(no_mangle)]
pub extern "C" fn core_todo() -> ! {
    core::todo!()
}
