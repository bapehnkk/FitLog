// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


pub fn main() {
    fitlog_lib::AppBuilder::new().run();
}