<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDesignGalleriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('design_galleries', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('title');
			$table->string('short_title');
			$table->string('slug')->unique();
			$table->string('image_url');
			$table->integer('sort_pos');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('design_galleries');
	}

}
