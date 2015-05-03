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
			$table->string('title')->nullable()->default('NULL');
			$table->string('subtitle')->nullable()->default('NULL');
			$table->text('body')->nullable();
			$table->string('footer')->nullable()->default('NULL');
			$table->string('bgColor')->nullable()->default('aaaaaa');
			$table->string('location')->nullable()->default('NULL');
		});
		DB::statement("ALTER TABLE `design_entries` ADD
									 type TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0 = img; 1 = vid; 2 = text'");
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
