<?php 

namespace OcadeChild;

/** Suppression des commentaires dans Wordpress */
function RemoveComments () {
  //Désactiver les commentaires
  function disable_comments_post_types_support() {
  $post_types = get_post_types();
  foreach ($post_types as $post_type) {
    if(post_type_supports($post_type,'comments')) {
    remove_post_type_support($post_type,'comments');
    remove_post_type_support($post_type,'trackbacks');
      }
  }
  }
  add_action('admin_init', function () { 
  $post_types = get_post_types();
  foreach ($post_types as $post_type) {
    if(post_type_supports($post_type,'comments')) {
      remove_post_type_support($post_type,'comments');
      remove_post_type_support($post_type,'trackbacks');
    }
  }
  });

  //Cacher les menus des commentaires dans l'administration
  add_action('admin_menu', function () {   remove_menu_page('edit-comments.php'); });

  //Désactiver la fonctionnalité de commentaires dans le frontend
  add_filter('comments_open', function () { return false; }, 20, 2);

  //Désactiver la zone de commentaires sur les pages de publication et d'édition des articles
  add_action('admin_init', function () {
  remove_meta_box('commentsdiv', 'post', 'normal');
  remove_meta_box('commentstatusdiv', 'post', 'normal');
  remove_meta_box('trackbacksdiv', 'post', 'normal');
  });
}
add_action( 'after_setup_theme', function () { RemoveComments(); } );