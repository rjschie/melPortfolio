<?php

class Video extends Eloquent {

	protected $fillable = [
		'title',
		'image_url',
		'video_url',
		'sort_pos'
	];

	public $table = 'videos';
	public $timestamps = false;

}