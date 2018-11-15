class SessionsController < ApplicationController
  def new

  end

  def create

    user= User.find_by(username: params[:username])
    if user && user.authenticate(params[:password])
        session[:user_id] = user.id
        flash[:notice] = "you logged in"
      redirect_to root_path
      else
          flash[:error] = "There is something wrong"
      redirect_to register_path
      end



  end

  def destroy
    session[:user_id] = nil
    flash[:notice] = "you logged out"
    redirect_to root_path
  end

end