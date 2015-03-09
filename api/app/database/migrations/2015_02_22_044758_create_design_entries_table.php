<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDesignEntriesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('design_entries', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('design_gallery_id');
			$table->string('title');
			$table->string('location');
			$table->string('is_vid');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('design_entries');
	}

}
