class Test2 < ActiveRecord::Migration
  def change
    add_column :testing, :address, :string, default: nil
  end
end
