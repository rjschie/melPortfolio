<?php

class DesignGallery extends Eloquent {

	protected $fillable = [ 'title', 'short_title', 'slug','image' ];

	public $table = 'design_galleries';
	public $timestamps = false;

}