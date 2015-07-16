<?php

class Video extends Eloquent {

	protected $fillable = [
		'title',
		'image_url',
		'video_url'
	];

	public $table = 'videos';
	public $timestamps = false;

}