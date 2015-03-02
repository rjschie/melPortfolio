<?php

class DesignGallery extends Eloquent {

	protected $fillable = [ 'title', 'link','image' ];

	public $table = 'design_galleries';
	public $timestamps = false;

}