class AddPassWordDigestToOthers < ActiveRecord::Migration
  def change
    add_column :users, :password_digest, :str
  end
end
