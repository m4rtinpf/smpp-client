# Generated by Django 4.0.1 on 2022-01-18 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bind',
            name='addr_npi',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='bind',
            name='addr_ton',
            field=models.IntegerField(),
        ),
    ]
