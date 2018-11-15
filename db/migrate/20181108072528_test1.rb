class Test1 < ActiveRecord::Migration
  def change
    create_table :testing do |t|
      t.string :username
    end
  end
end
