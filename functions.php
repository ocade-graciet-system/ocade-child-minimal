<?php

namespace OcadeChild;

/** Charge les styles dans le front du site. */
function enqueue_front_styles() {
  $stylesheet_dir = get_stylesheet_directory();
  $stylesheet_uri = get_stylesheet_directory_uri();

  if (file_exists($stylesheet_dir . '/styles/css/main.min.css')) {
    wp_enqueue_style('front-style-main', $stylesheet_uri . '/styles/css/main.min.css');
  }
  if (file_exists($stylesheet_dir . '/fonts/fonts.css')) {
    wp_enqueue_style('front-fonts', $stylesheet_uri . '/fonts/fonts.css');
    /** Pas minifié */
  }
}
add_action('wp_enqueue_scripts', 'OcadeChild\enqueue_front_styles');

/** Charger du CSS dans l'editeur gutenberg en prenant le nom des fichiers générer dans le dossier css de ocade-child */
function enqueue_editor_styles() {
  $stylesheet_dir = get_stylesheet_directory();
  $stylesheet_uri = get_stylesheet_directory_uri();

  if (file_exists($stylesheet_dir . '/styles/css/main-editor.min.css')) {
    /** main-editor.min.css est un  */
    wp_enqueue_style('editor-style-main', $stylesheet_uri . '/styles/css/main-editor.min.css');
  }
  if (file_exists($stylesheet_dir . '/fonts/fonts.css')) {
    wp_enqueue_style('editor-fonts', $stylesheet_uri . '/fonts/fonts.css');
    /** Pas minifié */
  }
}
add_action('enqueue_block_editor_assets', 'OcadeChild\enqueue_editor_styles');

require_once plugin_dir_path(__FILE__) . 'includes/functions/Custom-Bo.php';