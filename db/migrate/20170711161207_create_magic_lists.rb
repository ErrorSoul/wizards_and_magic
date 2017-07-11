class CreateMagicLists < ActiveRecord::Migration[5.1]
  def change
    create_table :magic_lists do |t|
      t.belongs_to :magic, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.integer :price

      t.timestamps
    end
  end
end
