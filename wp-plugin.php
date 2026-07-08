<?php
/**
 * Plugin Name: ForSales Growth System
 * Description: Embeds the ForSales Growth System CRM and Lead Generator into your WordPress dashboard.
 * Version: 1.0
 * Author: AI Studio
 */

if (!defined('ABSPATH')) {
    exit;
}

function forsales_add_admin_menu() {
    add_menu_page(
        'ForSales CRM',
        'ForSales CRM',
        'manage_options',
        'forsales-growth-system',
        'forsales_render_dashboard',
        'dashicons-chart-line',
        2
    );
}
add_action('admin_menu', 'forsales_add_admin_menu');

function forsales_render_dashboard() {
    // You can host the compiled /dist folder of the ForSales app and provide the URL here
    $app_url = 'YOUR_APP_URL_HERE'; 
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">ForSales Growth System</h1>
        <hr class="wp-header-end">
        <div style="background: #fff; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <iframe src="<?php echo esc_url($app_url); ?>" width="100%" height="850px" style="border:none;"></iframe>
        </div>
        <p style="margin-top: 10px; color: #666;"><em>Note: Replace <code>YOUR_APP_URL_HERE</code> in <code>wp-plugin.php</code> with the actual URL where the ForSales app is hosted.</em></p>
    </div>
    <?php
}
