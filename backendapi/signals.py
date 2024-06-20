from django.db.models.signals import pre_save
from django.contrib.auth.models import User

# To call a function on an action, such as update a user
# Ex. we have a task of updating a user name with an email id. Whenever a user profile updates, automatically by this code, user name will be set to an email. 
def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email

    print('Signal Triggered')

pre_save.connect(updateUser,sender=User)