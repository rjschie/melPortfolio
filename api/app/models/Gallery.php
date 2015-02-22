<?php

class Gallery extends Eloquent {

	protected $fillable = [ 'title', 'link','image_filename' ];

	public $table = 'galleries';
	public $timestamps = false;

}