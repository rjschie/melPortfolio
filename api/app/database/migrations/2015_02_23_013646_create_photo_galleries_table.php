<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhotoGalleriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('photo_galleries', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('title');
			$table->string('short_title');
			$table->string('slug')->unique();
			$table->integer('sort_pos')->unique();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('photo_galleries');
	}

}
