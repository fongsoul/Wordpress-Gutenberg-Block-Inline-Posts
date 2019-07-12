<?php

// 禁止直接访问
if (!defined('ABSPATH')) {
    exit;
}

// 队列块样式和脚本在前台页面
add_action('enqueue_block_assets', function () {
    wp_enqueue_style(
        'gutenberg-block-inline-posts-style',
        plugins_url('/dist/block.style.build.css', __DIR__)
    );
});

// 队列块样式和脚本在编辑页面
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script(
        'gutenberg-block-inline-posts-script',
        plugins_url('/dist/block.build.js', __DIR__),
        array('wp-blocks', 'wp-i18n', 'wp-element')
    );

    wp_enqueue_style(
        'gutenberg-block-inline-posts-style',
        plugins_url('dist/block.editor.build.css', __DIR__),
        array('wp-edit-blocks')
    );

    wp_enqueue_style(
        'wp-block-inline-posts',
        plugins_url('dist/block.style.build.css', __DIR__),
        array('wp-edit-blocks')
    );
});
