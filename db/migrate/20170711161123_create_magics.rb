class CreateMagics < ActiveRecord::Migration[5.1]
  def change
    create_table :magics do |t|
      t.string :name

      t.timestamps
    end
  end
end
