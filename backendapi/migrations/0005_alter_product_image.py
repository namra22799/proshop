# Generated by Django 5.0.3 on 2024-04-25 01:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0004_alter_order_createdat'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='/placeholder.png', null=True, upload_to=''),
        ),
    ]
