<?php

use Illuminate\Support\Facades\Route;

Route::view('static/blog', 'static.blog');
Route::view('static/post', 'static.post');

Route::domain('random-thoughts-lou.test')->group(function () {
    Route::statamic('/', 'blog_LOU', ['title' => 'Blog Lou']);
});
