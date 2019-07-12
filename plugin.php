<?php
/**
 * Plugin Name: 古腾堡内链帖子块
 * Plugin URI: https://github.com/mousin/WordPress-Gutenberg-Block-Inline-Posts/
 * Description: 在帖子页面内链引用其他本地帖子。
 * Author: Mousin
 * Author URI: https://mousin.cn
 * Version: 1.0.0
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// 禁止直接访问
if (!defined('ABSPATH')) {
    exit;
}

define('PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));

/**
 * 初始化
 */
require_once PLUGIN_DIR_PATH . 'core/init.php';
