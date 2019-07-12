<?php

// 禁止直接访问
if (!defined('ABSPATH')) {
    exit;
}

require_once PLUGIN_DIR_PATH . 'core/scripts-and-styles.php'; // 队列样式和脚本
require_once PLUGIN_DIR_PATH . 'core/render.php'; // 引入渲染函数

add_action('init', function () {
    // 注册块类型
    register_block_type(
        'mousin/inline-posts',
        array(
            'attributes' => array(
                'selectedPosts' => array(
                    'type' => 'array',
                    'default' => array(),
                ),
                'className' => array(
                    'type' => 'string',
                    'default' => ''
                )
            ), // 规定属性类型并给予默认值
            'render_callback' => 'inline_posts_render', // 执行渲染
        )
    );
});
