<?php 

namespace OcadeChild;

/** Cacher menus dans l'admin bar du back-office */
function Remove_item_admin_menu() {
  echo '<style>
  /** Cache le menu commentaires */
  #menu-comments {
    display: none;
  }
  
  /** Réglages Kadence blocks */
  #toplevel_page_kadence-blocks {
    display: none;
  }

  /** Loco Translate */
  #toplevel_page_loco {
    display: none;
  }
  </style>';
}
add_action('admin_head', 'OcadeChild\Remove_item_admin_menu');


/** Cacher menus dans l'admin bar du back-office */
function Add_custom_color_item_admin_menu() {
  echo '<style>
  
  #toplevel_page_ocade-settings .wp-menu-image.svg,
  #toplevel_page_ocade .wp-menu-image.svg,
  #menu-posts-header .wp-menu-image.svg,
  #menu-posts-footer .wp-menu-image.svg,
  #menu-posts-404 .wp-menu-image.svg,
  #menu-posts-archives .wp-menu-image.svg,
  #menu-posts-categorie .wp-menu-image.svg,
  #menu-posts-ocade-maps .wp-menu-image.svg,
  #menu-posts-produits .wp-menu-image.svg,
  #menu-posts-categories-produits .wp-menu-image.svg {
    background-color: #ff0066;
    background-size: 15px !important;
    border-radius: 4px;
    margin-right: 2px;
    width: 20px;
    height: 20px;
    margin-top: .2rem;
    margin-left: 6px;
    background-image: none !important;
  }

  #toplevel_page_ocade-settings .wp-menu-image.svg,
  #toplevel_page_ocade .wp-menu-image.svg {
    background-color: #E6E7E8;
  }

  #menu-posts-header .wp-menu-image.svg,
  #menu-posts-footer .wp-menu-image.svg {
    background-color: #55ACEE;
  }

  #menu-posts-404 .wp-menu-image.svg {
    background-color: #F4900C;
  }

  #menu-posts-archives .wp-menu-image.svg,
  #menu-posts-categorie .wp-menu-image.svg {
    background-color: #78B159;
  }

  #menu-posts-ocade-maps .wp-menu-image.svg {
    background-color: #AA8ED6;
  }

  #menu-posts-produits .wp-menu-image.svg,
  #menu-posts-categories-produits .wp-menu-image.svg {
    background-color: #C1694F;
  }

  #toplevel_page_ocade-settings a,
  #toplevel_page_ocade a,
  #menu-posts-header a,
  #menu-posts-footer a,
  #menu-posts-404 a,
  #menu-posts-archives a,
  #menu-posts-categorie a,
  #menu-posts-ocade-maps a,
  #menu-posts-produits a,
  #menu-posts-categories-produits a {
    color: #fff !important;
  }

  #toplevel_page_ocade-settings a .wp-menu-name,
  #toplevel_page_ocade a .wp-menu-name,
  #menu-posts-header a .wp-menu-name,
  #menu-posts-footer a .wp-menu-name,
  #menu-posts-404 a .wp-menu-name,
  #menu-posts-archives a .wp-menu-name,
  #menu-posts-categorie a .wp-menu-name,
  #menu-posts-ocade-maps a .wp-menu-name,
  #menu-posts-produits a .wp-menu-name,
  #menu-posts-categories-produits a .wp-menu-name {
    padding: 4px 8px !important;
    margin-left: 1.5rem !important;
  }

  </style>';
}
add_action('admin_head', 'OcadeChild\Add_custom_color_item_admin_menu');
