<?php

/**
 * 渲染 “Inline Posts” 块
 *
 * @param Array $attributes - 块中的属性数组
 * @return string
 */
function inline_posts_render($attributes = array(), $content)
{
    if (!empty($content)) {
        return $content;
    }

    $selected_posts = isset($attributes['selectedPosts']) ? $attributes['selectedPosts'] : array();

    if (empty($selected_posts)) {
        return;
    }

    $query = new WP_Query(array(
        'post_type' => array('post'),
        'post__in' => $selected_posts,
        'orderby' => 'post__in',
    ));

    if (!$query->have_posts()) {
        return;
    }

    $classes = array('wp-block-inline-post');
    if (!empty($attributes['className'])) {
        $classes[] = $attributes['className'];
    }
    $classes = implode(' ', $classes);

    ob_start();
    echo '<div class="' . $classes . '">';
    while ($query->have_posts()) :
        $query->the_post();
    $media = get_the_post_thumbnail_url(); ?>
<div class="block-inline-post">
    <?php if ($media) : ?>
    <div class="block-inline-post-media" style="background-image: url(<?php echo $media; ?>);">
    </div>
    <?php endif; ?>
    <div class="block-inline-post-wrapper">
        <div class="block-inlie-post-title"><?php the_title(); ?>
        </div>
        <div class="block-inline-post-excerpt"><?php the_excerpt() ?>
        </div>
        <div class="block-inline-post-read-more">
            <a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>" target="_blank"><?php _e('阅读更多')?></a>
        </div>
    </div>
</div>
<?php
    endwhile;
    echo '</div>';

    // 默认下，add_action('the_content', 'do_blocks') 优先级比 add_action('the_content', 'wpautop') 高
    // 没有使用 remove_action('the_content', 'wpautop'); 的情况下
    // 内级标签会被 <p></p> 包裹，和 换行变成 </br> 标签
    // 因此破坏掉固定的渲染模板，所有每个行级标签必须单独被一个块级标签包裹，再让这个块级元素的 css 变成行级别
    // 去除标签与标签间的空格、换行，防止 wpautop 加上 <p> 或 <br> 样式影响渲染结果
    return preg_replace('/>\s*</', '><', ob_get_clean());
}
